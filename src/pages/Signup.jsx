import Header from "../comp/header";
import Footer from "../comp/Footer";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import Loading from "./loading.jsx";
import Wrong from "./wrong";

// not sign up => done
// loading => done
// sign up without email verification
// sign up with email verification naviage(/)
const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    if (user) {
      if (!user.emailVerified) {
        return navigate("/signup");
      } else {
        return navigate("/");
      }
    }
  });
  if (loading) return (
    <>
  <Loading />
    </>
  )
  if (error) return(<> <Wrong /></>)
  if (user) {
    if (!user.emailVerified) {
      return (
        <div>
          <Header />
          <main>
            <h1>Please verify your Email..</h1>
          </main>
          <Footer />
        </div>
      );
    } else {
       navigate("/");
    }
  }

  if (!user) {
    return (
      <>
        <Helmet>
          <title>Signup</title>
        </Helmet>
        <Header />

        <main>
          <form>
            <p style={{ fontSize: "23px", marginBottom: "22px" }}>
              Create a new account <span>🧡</span>{" "}
            </p>
            <input
              onChange={(e) => {
                setUserName(e.target.value);
              }}
              required
              placeholder=" User Name : "
              type="text"
            />
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
              placeholder=" E-mail : "
              type="email"
            />
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
              placeholder=" Password : "
              type="password"
            />
            <button
              onClick={(e) => {
                e.preventDefault();

                createUserWithEmailAndPassword(auth, email, password)
                  .then((userCredential) => {
                    // Signed in

                    sendEmailVerification(auth.currentUser).then(() => {
                      // Email verification sent!
                      // ...
                      console.log("email sent");
                    });

                    updateProfile(auth.currentUser, {
                      displayName: userName,
                    })
                      .then(() => {
                        // Profile updated!
                        // ...

                        if (loading) {
                          return (
                            <div>
                              <Loading />
                            </div>
                          );
                        }
                        if (user) {
                          if (!user.emailVerified) {
                            return <div>please verify your email</div>;
                          } else {
                            return <div>done</div>;
                          }
                        }
                      })
                      .catch((error) => {
                        // An error occurred
                        // ...
                      });
                    const user = userCredential.user;
                    // ...
                  })
                  .catch((error) => {
                    const errorMessage = error.message;
                    <h2>{errorMessage}</h2>;
                    // ..
                  });
              }}
            >
              Sign up
            </button>
            <p className="account">
              Already hava an account <Link to="/signin"> Sign-in</Link>
            </p>
          </form>
        </main>
        <Footer />
      </>
    );
  }
};

export default Signup;
