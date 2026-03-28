export default function WhyCourseifyPage() {
    return (
      <div className="p-8 md:p-12 lg:p-16 max-w-3xl mx-auto h-full text-white font-sans">
        <h1 className="text-3xl md:text-4xl font-display font-medium text-white mb-12">
          Why Courseify
        </h1>
  
        <div className="space-y-6 text-gray-300 text-base md:text-lg leading-relaxed">
          <p>
            Courseify exists because most learning tools are designed to keep you <span className="text-red-400">watching</span>, not <span className="text-red-400">finishing</span>.
          </p>
  
          <p>
            They reward attention, not progress. They make starting easy and finishing optional.
          </p>
  
          <p>
            Courseify is built for the <span className="text-red-400">opposite goal</span>.
          </p>
  
          <div className="w-full h-px bg-white/10 my-8"></div>
  
          <p>
            Most platforms optimize for engagement.
          </p>
  
          <p>
            More recommendations. More distractions. More noise.
          </p>
  
          <p>
            Courseify optimizes for completion.
          </p>
  
          <ul className="list-disc list-inside space-y-4 font-medium pl-2 py-4">
            <li>No algorithmic feed</li>
            <li>No endless recommendations</li>
            <li>One active course at a time</li>
            <li>Clear progress and a visible finish</li>
          </ul>
  
          <p>
            The goal isn't discovery.
            <br />
            The goal is to actually <span className="text-red-400 font-medium">finish</span> what you started.
          </p>
        </div>
      </div>
    );
  }
