import React, { useState, useEffect } from "react";
import { Button, message, Card, Select, Typography, Spin } from "antd";
import axios from "axios";


const { Title, Text } = Typography;
const { Option } = Select;

const GeoFenceAttendance = ({ employeeId, projectId }) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [insideGeofence, setInsideGeofence] = useState(false);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState("AM_LOGIN");

  const BASE_URL = "http://localhost:5000"; 

  // Fetch current GPS location
  const getLocation = () => {
    if (!navigator.geolocation) {
      message.error("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        validateGeofence(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        message.error("Unable to retrieve your location");
        setLoading(false);
      }
    );
  };

  // Validate geofence with backend
  const validateGeofence = async (lat, lon) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/attendance/validate-geofence`, {
        projectId:12345,
        latitude: lat,
        longitude: lon,
      });

      setInsideGeofence(res.data.insideGeofence);
      if (!res.data.insideGeofence) {
        message.warning("You are outside the project geofence!");
      } else {
        message.success("You are inside the geofence");
      }
    } catch (err) {
      message.error("Error validating geofence");
    } finally {
      setLoading(false);
    }
  };

  // Submit attendance
  const submitAttendance = async () => {
    if (!insideGeofence) {
      message.error("Cannot submit attendance outside geofence");
      return;
    }
    if (latitude === null || longitude === null) {
      message.error("Location not found. Please fetch location first.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/api/attendance/submit`, {
        id: Date.now(), // simple unique ID
        employeeId:1,
        projectId:12345,
        session,
        latitude,
        longitude,
      });

      message.success(res.data.message);

      // Toggle session automatically
      switch (session) {
        case "AM_LOGIN":
          setSession("AM_LOGOUT");
          break;
        case "AM_LOGOUT":
          setSession("PM_LOGIN");
          break;
        case "PM_LOGIN":
          setSession("PM_LOGOUT");
          break;
        case "PM_LOGOUT":
          message.info("All sessions completed for today");
          break;
        default:
          setSession("AM_LOGIN");
      }
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Error submitting attendance");
    } finally {
      setLoading(false);
    }
  };
    useEffect(() => {
    const logLocation = async () => {
      if (!latitude || !longitude) return;
      try {
        await axios.post(`${BASE_URL}/api/attendance/log-location`, {
          id: Date.now(),
          employeeId,
          projectId,
          latitude,
          longitude,
        });
        console.log("Location logged automatically");
      } catch (err) {
        console.error("Error logging location", err);
      }
    };

    const interval = setInterval(() => {
      logLocation();
    }, 5 * 60 * 1000); // every 5 minutes

    return () => clearInterval(interval);
  }, [latitude, longitude]);

  return (
    <div className="flex justify-center mt-10">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <Title level={3} className="text-center mb-4">
          Geo-Fenced Attendance
        </Title>

        <div className="mb-4">
          <Text strong>Current Session:</Text> {session}
        </div>

        <div className="mb-4">
          <Text strong>Location:</Text>{" "}
          {latitude && longitude
            ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            : "Not fetched"}
        </div>

        <div className="mb-4">
          <Text strong>Status:</Text>{" "}
          {insideGeofence ? (
            <span className="text-green-600 font-semibold">Inside Geofence</span>
          ) : (
            <span className="text-red-600 font-semibold">Outside Geofence</span>
          )}
        </div>

        <div className="flex justify-between">
          <Button type="default" onClick={getLocation} disabled={loading}>
            {loading ? <Spin /> : "Get My Location"}
          </Button>
          <Button
            type="primary"
            onClick={submitAttendance}
            disabled={loading || !latitude || !longitude}
          >
            {loading ? <Spin /> : "Submit Attendance"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default GeoFenceAttendance;
