
import LastVisitedRedirect from "@/components/LastVisitedRedirect";

export default function AboutPage() {

  return (
    
    <div>
       <LastVisitedRedirect />
      <h1 className="text-2xl font-bold mb-4">About Me</h1>
      <p>Name: Your Name</p>
      <p>Student Number: 123456</p>

      <div className="mt-4">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="Demo Video"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
