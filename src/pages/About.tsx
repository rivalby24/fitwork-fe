import NavbarLanding from "@/components/NavbarLanding";
import Footer from "@/components/FooterLanding";
import AmbiyaImage from "@/assets/Ambiya.jpg";
import RivalbyImage from "@/assets/Rivalby.jpeg";
import EllyazarImage from "@/assets/Ellyazar.jpeg";
import RakaImage from "@/assets/Raka.jpeg";

function About() {
  const team = [
    { name: "Raka", role: "BackEnd Developer", image: RakaImage },
    { name: "Rivalby", role: "FrontEnd Developer", image: RivalbyImage },
    { name: "Ellyazar", role: "UI/UX Designer", image: EllyazarImage },
    {
      name: "Ambiya",
      role: "FrontEnd Developer",
      image: AmbiyaImage,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavbarLanding />

      <div className="grid grid-cols-2 w-full h-[300px]">
        <div className="bg-gray-200 p-10">
          <h2 className="text-xl font-bold mb-4">Vision</h2>
          <p className="text-sm ">
            To be the company's main partner in creating a harmonious and
            productive work environment through cultural fit supported by
            advanced AI technology.
          </p>
        </div>
        <div className="bg-neutral-700 text-white p-10">
          <h2 className="text-xl font-bold mb-4">Mission</h2>
          <p className="text-sm">
            1. Develop an AI-based solution to automatically identify cultural
            fit between candidates and companies.
            <br />
            2. Empower companies to customize their recruitment process based on
            their Employee Value Proposition (EVP).
            <br />
            3. Improve the quality of recruitment by helping to find talent that
            is not only competent, but also aligned with the company's values,
            mission, and work culture.
            <br />
            4. Drive data-driven decision-making that supports solid and
            sustainable team growth.
            <br />
            5. Provide an intuitive, efficient, and reliable user experience for
            HR teams and recruiters.
          </p>
        </div>
      </div>

      <div className="text-center py-20 bg-white ">
        <h2 className="text-xl font-semibold mb-4">Fitwork</h2>
        <p className="text-sm text-center text-black font-normal leading-6 max-w-xl mx-auto">
          FitWork is an AI-based software solution that automatically generates
          culture fit assessments based on a company's Employee Value
          Proposition (EVP). Fitwork helps companies find candidates who best
          fit their values, mission, and work culture.
        </p>
      </div>

      <div className="bg-gray-200 p-10">
        <h2 className="text-right text-xl font-semibold mb-8 mr-8">About Us</h2>
        <div className="grid grid-cols-2 gap-6">
          {team.map((person, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg flex items-center p-6 space-x-6">
              <div className="w-28 h-28 flex-shrink-0 rounded-full overflow-hidden bg-gray-100">
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-black font-semibold text-lg">
                  {person.name}
                </div>
                <div className="text-neutral-600 text-sm">{person.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-neutral-700 text-white p-10">
        <h2 className="text-lg font-semibold mb-4 text-right">
          What Makes Us Different
        </h2>
        <p className="text-sm">
          At FitWork, we don’t just provide technology, we build meaningful
          connections between companies and talents through a unique Employee
          Value Proposition (EVP)-based approach. Combining artificial
          intelligence and a deep understanding of work culture, FitWork
          automatically generates accurate and relevant culture fit assessments.
          We believe that successful recruitment depends not only on skills, but
          also on alignment of values ​​and vision. This is what makes us
          different. We don’t just help you recruit, but ensure that every
          candidate truly fits and grows with your company culture.
        </p>
      </div>

      <Footer />
    </div>
  );
}

export default About;
