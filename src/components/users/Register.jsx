import { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Container,
  TextField,
  Typography,
  Stack,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import axios from "axios";
import { API_REGISTER } from "../../Utilities";

export default function Register() {
  const history = useHistory();
  const userFields = { email: "", name: "", password: "", phone: "" };
  const [userDetails, setUserDetails] = useState(userFields);
  const [showAlert, setShowAlert] = useState({
    show: false,
    vertical: "top",
    horizontal: "right",
    type: "success",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const { show, vertical, horizontal, type, message } = showAlert;

  const handleChange = ({ target: { name, value } }) =>
    setUserDetails({ ...userDetails, [name]: value });

  const registerUser = async () => {
    setLoading(true);
    await axios
      .post(API_REGISTER, { ...userDetails, type: "admin" })
      .then(function (res) {
        if (res.data)
          if (res.status === 200) {
            setLoading(false);
            setShowAlert({
              ...showAlert,
              type: "success",
              message: "Registration completed successfully",
              show: true,
            });
            setUserDetails(userFields);
          }
      })
      .catch(function (err) {
        setLoading(false);
        //setShowAlert({...showAlert,show:true,type:'error',message:err.response.data.message});
      });
  };

  const alertBoxClose = () => setShowAlert({ ...showAlert, show: false });

  return (
    <>
      <Container maxWidth="sm">
        <Stack
          spacing={2}
          sx={{ mt: 3 }}
          direction="column"
          alignItems="center"
        >
          <Typography variant="h4" sx={{ mt: 5 }}>
            Sign up
          </Typography>
          <TextField
            fullWidth
            onChange={handleChange}
            value={userDetails.name}
            required
            type="text"
            variant="filled"
            name="name"
            label="Name"
          ></TextField>
          <TextField
            fullWidth
            onChange={handleChange}
            value={userDetails.email}
            required
            type="email"
            variant="filled"
            name="email"
            label="Email"
          ></TextField>
          <TextField
            fullWidth
            onChange={handleChange}
            value={userDetails.phone}
            type="phone"
            variant="filled"
            name="phone"
            label="Phone"
          ></TextField>
          <TextField
            fullWidth
            onChange={handleChange}
            value={userDetails.password}
            required
            type="password"
            variant="filled"
            name="password"
            label="Password"
          ></TextField>
        </Stack>
        <Stack spacing={2} sx={{ mt: 3 }} alignItems="flex-start">
          {/*<FormControlLabel control={<Checkbox id="terms"/>} label="I agree to terms and conditions"></FormControlLabel>*/}
          <LoadingButton
            loadingPosition="end"
            loading={loading}
            onClick={() => registerUser()}
            fullWidth
            variant="outlined"
            size="large"
            sx={{ padding: 1.5 }}
          >
            Sign up
          </LoadingButton>
        </Stack>
        <Stack
          sx={{ mt: 2 }}
          direction="row"
          justifyContent="space-between"
          spacing={12}
        >
          <Link
            onClick={() => history.push("/login")}
            variant="body2"
            color="primary"
            sx={{ cursor: "pointer" }}
          >
            Already have an account? Login here
          </Link>
          <Link
            onClick={() => history.push("/forgot-password")}
            variant="body2"
            color="primary"
            sx={{ cursor: "pointer" }}
          >
            Forgot password?
          </Link>
        </Stack>
      </Container>
      <Snackbar
        open={show}
        autoHideDuration={6000}
        onClose={alertBoxClose}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert severity={type} variant="filled" sx={{ width: "100%", pr: 30 }}>
          {/*<AlertTitle>{type}</AlertTitle>*/}
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}
