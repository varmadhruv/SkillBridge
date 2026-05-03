import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from '@vitejs/plugin-basic-ssl';
import { resolve } from "path";

export default defineConfig({
  plugins: [react(), basicSsl()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        rolePage: resolve(__dirname, "Role_Page/index.html"),
        studentLogin: resolve(__dirname, "Student_SignUp/index.html"),
        studentConsent: resolve(__dirname, "Student_SignUp/Student_Consent/index.html"),
        studentMainLogin: resolve(__dirname, "Student_SignUp/Main_Student_SignUp_Interface/index.html"),
        studentHomePage: resolve(__dirname, "Student_Home_page/index.html"),
        mentorLogin: resolve(__dirname, "Mentor_SignUp/index.html"),
        mentorAcknowledgement: resolve(__dirname, "Mentor_SignUp/aknowledgement.html"),
        mainLogin: resolve(__dirname, "Mentor_Main_SignUp_Interface/index.html"),
        mentorHome: resolve(__dirname, "Mentor_home_page/index.html"),
        mentorAbout: resolve(__dirname, "Mentor_home_page/about_us.html"),
        mentorContact: resolve(__dirname, "Mentor_home_page/contact_us.html"),
        mentorFeedback: resolve(__dirname, "Mentor_home_page/feedback.html"),
        mentorHelp: resolve(__dirname, "Mentor_home_page/help.html"),
        alreadyAccount: resolve(__dirname, "LogIn/index.html"),
        loginRole: resolve(__dirname, "LogIn/role/index.html"),
        studentLoginNew: resolve(__dirname, "LogIn/Student_LogIn/index.html"),
        mentorLoginNew: resolve(__dirname, "LogIn/Mentor_LogIn/index.html"),
        diveIn: resolve(__dirname, "Dive_in/index.html"),
        adminLogin: resolve(__dirname, "Admin/Login/index.html"),
        adminDashboard: resolve(__dirname, "Admin/admin_dashboard/index.html"),
        developerSignup: resolve(__dirname, "Developer/dev_create_ac/index.html"),
        developerLogin: resolve(__dirname, "Developer/Login/index.html"),
        developerValidation: resolve(__dirname, "Developer/validation/index.html"),
        developerHome: resolve(__dirname, "Developer/dev_home/index.html"),
        developerNewAdmin: resolve(__dirname, "Developer/new_admin/index.html"),
        developerExploreAdmin: resolve(__dirname, "Developer/Explore_admin/index.html"),
        blockPage: resolve(__dirname, "Block_page/index.html"),
        checkout: resolve(__dirname, "Checkout/index.html"),
        mentorUpdates: resolve(__dirname, "Mentor_home_page/updates.html"),

        payment: resolve(__dirname, "payment/index.html"),
        zoom: resolve(__dirname, "Zoom/index.html"),
        otpAuthenticate: resolve(__dirname, "Otp_authenticate/index.html"),
        mentorOtpAuthenticate: resolve(__dirname, "mentor_otp_authentication/index.html"),
        adminOtpAuthenticate: resolve(__dirname, "Admin/admin_otp_authentication/index.html"),
        devOtpAuthenticate: resolve(__dirname, "Developer/dev_otp_authentication/index.html"),
        forgotMentorPassword: resolve(__dirname, "forgot_mentor_password/index.html"),
        forgotStudentPassword: resolve(__dirname, "forgot_student_password/index.html"),
        forgotAdminPassword: resolve(__dirname, "forgot_admin_password/index.html"),
        forgotDevPassword: resolve(__dirname, "forgot_dev_password/index.html")
      }
    }
  }
});
