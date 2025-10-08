import LastVisitedRedirect from "@/components/LastVisitedRedirect";

export default function AboutPage() {

  return (
    
    <div>
       <LastVisitedRedirect />
      <h1 className="text-2xl font-bold mb-4">About Me</h1>
      <p>Name: Muhammad Raihan Zulfi</p>
      <p>Student Number: 22586503</p>

      <div className="mt-4">
        <iframe
          width="100%"
          height="315"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="Demo Video"
          allowFullScreen
          style={{ maxWidth: '560px', margin: '0' }}
        ></iframe>
      </div>
    </div>
  );
}
