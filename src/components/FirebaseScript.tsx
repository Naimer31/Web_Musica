"use client";

import Script from "next/script";

export default function FirebaseScript() {
  return (
    <Script
      id="firebase-init"
      strategy="afterInteractive"
      type="module"
      dangerouslySetInnerHTML={{
        __html: `
          import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
          import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-analytics.js";

          const firebaseConfig = {
            apiKey: "AIzaSyBvEYLVt_SH0L_FAoObuH1pf8TQkT4Rv70",
            authDomain: "virtuoso-acadmy.firebaseapp.com",
            projectId: "virtuoso-acadmy",
            storageBucket: "virtuoso-acadmy.firebasestorage.app",
            messagingSenderId: "532811107930",
            appId: "1:532811107930:web:10807b96acdbd0b38c5263",
            measurementId: "G-3WJ41RFGF9"
          };

          // Initialize Firebase
          const app = initializeApp(firebaseConfig);
          const analytics = getAnalytics(app);
        `,
      }}
    />
  );
}
