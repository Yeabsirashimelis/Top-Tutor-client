"use client";
import { ClipLoader } from "react-spinners";

const override = { display: "block", margin: "100px auto" };

function LoadingPage({ loading }: { loading: boolean }) {
  return (
    <ClipLoader
      color="#0a1d30"
      loading={loading}
      cssOverride={override}
      size={150}
      aria-label="Loading Spinner"
    />
  );
}

export default LoadingPage;
