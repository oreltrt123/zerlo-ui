export default function NewsLetter() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background shader */}
      <div className="absolute inset-0"     style={{
      backgroundSize: "100% auto", // full width, auto height
      backgroundPosition: "center -130px", // move image down
      backgroundRepeat: "no-repeat",
      backgroundImage: 'url("/assets/images/bg.jpg")'
    }}>

      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-8">
        <div className="max-w-2xl w-full text-center space-y-8">
<h1 style={{fontSize: "25px"}} className="text-black font-sans font-light italic">
  Meet <span className="bg-[#80919c65]">Zerlo</span>, a new brand of game <span className="bg-[#80919c65]">building</span> that has come to 
  change the creation of the <span className="bg-[#80919c65]">3D game</span> world. With Zerlo, you can build 
  any game you want, any small <span className="bg-[#80919c65]">idea</span> from the beginning, from the base, from the first line 
  of code to the final result of the <span className="bg-[#80919c65]">3D game</span>. <span className="bg-[#80919c65]">Graphics</span>, <span className="bg-[#80919c65]">sound effects</span>, <span className="bg-[#80919c65]">characters</span>,
  Internet access, access to app games, and soon <span className="bg-[#80919c65]">Google Play</span> and <span className="bg-[#80919c65]">iOS</span> compatibility, all in a <span className="bg-[#80919c65]">free package</span>. 
  Zerlo is here to change the world. What makes it special is that it takes a simple <span className="bg-[#80919c65]">frontend</span> and improves 
  it to its maximum potential. It will create everything for you from scratch in just a few <span className="bg-[#80919c65]">seconds</span>, with 
  the code you choose, the <span className="bg-[#80919c65]">AI</span> you choose, and all the features that are supported for free. It is currently fully 
  supported for free, and you can submit as many frontends as you want, build as many things as you want, everything 
  is free. It is currently in <span className="bg-[#80919c65]">beta</span>, so you can use it completely for
  free, with comprehensive support for all projects, links, codes, and everything else.
</h1>

        </div>
      </div>
    </main>
  )
}
