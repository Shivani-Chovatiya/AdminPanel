import { Outlet } from "react-router-dom";
import TherapistSideBar from "../TherapistPanel/TherapistSideBar";
import TherapistHeader from "../TherapistPanel/TherapistHeader";
import DisabledBack from "../DisabledBack";

const TherapistLayout = () => {
  DisabledBack();

  return (
    <div className="md:grid md:grid-cols-[256px_1fr] min-h-screen ">
      <TherapistSideBar />

      <main className="">
        <TherapistHeader />
        <Outlet />
      </main>
    </div>
  );
  a;
};

export default TherapistLayout;
