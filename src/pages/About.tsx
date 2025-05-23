import NavbarLanding from "@/components/NavbarLanding";
import Footer from "@/components/Footer";
import Image from "@/assets/Ambiya.jpg"; 

function About() {
  const team = [
    { name: "Raka", role: "with Company Culture" },
    { name: "Rivalby", role: "with Company Culture" },
    { name: "Ellyazar", role: "with Company Culture" },
    { name: "Ambiya", role: "with Company Culture" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavbarLanding />

      <div className="grid grid-cols-2 w-full h-[300px]">
        <div className="bg-gray-200 p-10">
          <h2 className="text-lg font-bold mb-4">Vision</h2>
          <p className="text-sm ">
            AI-based automated assessment to find workplaces that match your values and personality. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Alias, consequatur? Doloribus unde commodi ex corrupti veniam vel quas quasi cupiditate laboriosam deleniti officia explicabo accusantium dolores minus tempore, recusandae nobis.
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Animi ea est consequatur repellat, facere debitis quam modi maiores id accusantium quis, ullam libero? Esse modi, explicabo temporibus placeat in suscipit!
          </p>
        </div>
        <div className="bg-neutral-700 text-white p-10">
          <h2 className="text-lg font-bold mb-4">Mission</h2>
          <p className="text-sm">
            AI-based automated assessment to find workplaces that match your values and personality.
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque, labore sint aliquid numquam assumenda minus, rem, aspernatur tempora accusantium optio laborum delectus quibusdam aut reprehenderit obcaecati aliquam cupiditate distinctio quod!
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam repudiandae quidem, pariatur atque nihil in aliquam magnam ex consequatur, illum id soluta nisi dicta optio iure debitis minus maxime mollitia.
          </p>
        </div>
      </div>

      <div className="text-center py-20 bg-white ">
        <h2 className="text-lg font-semibold mb-4">Fitwork</h2>
        <p className="text-sm text-center text-black font-normal leading-6 max-w-xl mx-auto">
          Lu mau nyari kerjaan yang cocok sama kalcer lu? disini tempatnya coy
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sequi dolor, perspiciatis fugit ut tempora assumenda ducimus ex quod nulla repudiandae quia reiciendis excepturi voluptatibus architecto laboriosam dolorem ea, hic consequuntur?
        </p>
      </div>

      <div className="grid grid-cols-2 w-full">
        <div className="bg-neutral-700 text-white p-10">
          <h2 className="text-right text-lg font-semibold mb-4">What Makes Us Different</h2>
          <p className="text-sm justify-center">
            AI-based automated assessment to find workplaces that match your values and personality.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, nemo esse voluptas mollitia error quisquam quod optio alias aut voluptatibus voluptate explicabo facilis, ad cupiditate obcaecati iste doloremque neque. Iste?
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, fugit voluptatem molestias asperiores ipsum doloremque dolorem labore voluptate at, deserunt repudiandae unde cum autem maiores est aliquid minima explicabo? Dignissimos.

          </p>
        </div>

        <div className="bg-gray-200 p-10">
          <h2 className="text-right text-base font-semibold mb-4 mr-4">About Us</h2>
          <div className="grid grid-cols-2 gap-4">
            {team.map((person, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md flex items-center p-4 space-x-4">
                <img
                  src={Image}
                  alt={person.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="text-black font-medium">{person.name}</div>
                  <div className="text-neutral-600 text-sm">{person.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default About;
