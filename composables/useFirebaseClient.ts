// Import the functions you need from the SDKs you need
import {
  getAuth,
  createUserWithEmailAndPassword,
  setPersistence,
  inMemoryPersistence,
  signInWithEmailAndPassword,
  getIdToken,
  signOut,
  updateProfile,
  applyActionCode,
  sendPasswordResetEmail,
  confirmPasswordReset,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  TwitterAuthProvider,
  GithubAuthProvider,
  UserCredential,
  FacebookAuthProvider,
  updateCurrentUser,
  updateEmail,
  updatePassword,
} from "firebase/auth";

export default function useFirebaseClient() {
  const auth = useNuxtApp().$auth;

  const router = useRouter();

  const signUpUser = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
      });
      await sendEmailVerification(userCredential.user);
      return {
        success: true,
        message: "Email Verification sent. Please verify your email.",
      };
    } catch (error) {
      return {
        success: false,
        message: error + "",
      };
    }
  };

  const signInUser = async (email: string, password: string) => {
    try {
      await setPersistence(auth, inMemoryPersistence);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await getIdToken(userCredential.user);
      return { idToken, error: null };
    } catch (error) {
      return { idToken: null, error: error + "" };
    }
  };

  const signInUserWithGoogle = async () => {
    try {
      await setPersistence(auth, inMemoryPersistence);
      const userCredential = await signInWithPopup(
        auth,
        new GoogleAuthProvider()
      );
      const idToken = await getIdToken(userCredential.user);
      return { idToken, error: null };
    } catch (error) {
      return { idToken: null, error: error + "" };
    }
  };

  const signInUserWithTwitter = async () => {
    try {
      await setPersistence(auth, inMemoryPersistence);
      const userCredential = await signInWithPopup(
        auth,
        new TwitterAuthProvider()
      );
      const idToken = await getIdToken(userCredential.user);
      return { idToken, error: null };
    } catch (error) {
      return { idToken: null, error: error + "" };
    }
  };

  const signInUserWithFacebook = async () => {
    try {
      await setPersistence(auth, inMemoryPersistence);
      const userCredential = await signInWithPopup(
        auth,
        new FacebookAuthProvider()
      );
      const idToken = await getIdToken(userCredential.user);
      return { idToken, error: null };
    } catch (error) {
      return { idToken: null, error: error + "" };
    }
  };

  const applyUserActionCode = async (oobCode: string) => {
    try {
      await applyActionCode(auth, oobCode);
      return {
        success: true,
        message: "Email Verified. Now You Can Log In To the hibirLink System",
      };
    } catch (error) {
      return {
        success: false,
        message:
          "Your request to verify your email has expired or the link has already been used.",
      };
    }
  };

  const sendUserPasswordResetEmail = async (email: string) => {
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message:
          "Instruction to reset your password has been sent successfully",
      };
    } catch (error) {
      return { success: false, message: error + "" };
    }
  };

  const confirmUserPasswordReset = async (
    oobCode: string,
    newPassword: string
  ) => {
    const auth = getAuth();

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);

      return {
        success: true,
        message:
          "Password reset successfully. Now You can log in with your new password",
      };
    } catch (error) {
      return {
        success: false,
        message: error + "",
      };
    }
  };

  const signUserOut = async () => {
    await signOut(auth);
  };
  const updateUserPassword = async (NewPassword: any) => {
    try {
      const user = getAuth()?.currentUser;

      await updatePassword(user, NewPassword);
      return true;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const updateUserProfile = async (
    first_name: any,
    last_name: any,
    email: any
  ) => {
    try {
      const user = getAuth().currentUser;
      await updateProfile(user, {
        displayName: `${first_name} ${last_name}`,
        email: email,
      });

      return true;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  return {
    auth,
    signUpUser,
    signInUser,
    signInUserWithGoogle,
    signInUserWithTwitter,
    signInUserWithFacebook,
    signUserOut,
    confirmUserPasswordReset,
    sendUserPasswordResetEmail,
    applyUserActionCode,
    updateUserPassword,
    updateUserProfile,
  };
}
