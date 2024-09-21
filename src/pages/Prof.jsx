const Prof = () => {
  return (
    <div className="flex flex-col justify-start items-center pt-[95px] px-[25px] w-full h-dvh overflow-y-scroll no-scrollbart">
      <Intro />
    </div>
  );
};
export default Prof;

const Intro = () => {
  const prof = {
    img: "/img/people/director/prof.png",
    name: "KwanMyung Kim",
    role: "Lab Director - Tenured Full Professor",
    desc: "Dr. KwanMyung Kim is a full professor in Department of Design and the director of Integration and Innovation Design Lab (IIDL). He was a Dean of Graduate School of Creative Design Engineering during 2016-2020. He serves as an editor for Archives of Design Research and ICONARP International Journal of Architecture and Planning. He is also a CEO of ID SPACE Corp., a start-up company that commercializes academic research outcomes. Before joining UNIST, he worked in industry for 14 years as a product designer/engineer. With his strong practical knowledge and experience he peruses to integrate design and engineering, and industry and academic knowledge in the major IIDL’s research domains including Design for Elderly, Rehabilitation and Health Care.",
    stats: [
      { key: "Design Awards", value: 29 },
      { key: "Academic Awards", value: 7 },
      { key: "International Journal Publications", value: 14 },
      { key: "Conference Papers", value: 39 },
      { key: "Registered Patents", value: 27 },
    ],
    interests:
      "Integrated Design Methodology;  Product Design;  Engineering Design; Design Engineering;  New Product Design;  통합디자인방법론;  공학디자인;  디자인엔지니어링;  신제품개발",
  };

  return (
    <div className="flex flex-col gap-[30px] w-full">
      <div
        className="mx-auto w-full min-h-[360px]"
        style={{ backgroundImage: `url(${prof.img})`, backgroundSize: "cover" }}
      />
      <div className="flex flex-col gap-[10px] w-full">
        <div>
          <h2 className="font-semibold text-[16px] text-primary_main">{prof.role}</h2>
          <h1 className="font-bold text-[36px] text-text_black_primary leading-[36px]">
            {prof.name}
          </h1>
        </div>
        <h3 className="text-[12px] text-text_black_secondary">{prof.desc}</h3>
        {/* Stats */}
        <div className="flex flex-col items-center gap-[15px]">
          <div className="flex justify-center gap-[15px] w-full">
            <div className="max-w-[120px] text-center">
              <h1 className="font-semibold text-[64px] leading-[48px]">{prof.stats[0].value}</h1>
              <h3 className="text-[12px] text-text_black_secondary">{prof.stats[0].key}</h3>
            </div>
            <div className="max-w-[120px] text-center">
              <h1 className="font-semibold text-[64px] leading-[48px]">{prof.stats[1].value}</h1>
              <h3 className="text-[12px] text-text_black_secondary">{prof.stats[1].key}</h3>
            </div>
          </div>

          <div className="flex justify-center gap-[15px] w-full">
            {prof.stats.slice(2).map((elem) => (
              <div key={elem.key} className="max-w-[120px] text-center">
                <h1 className="font-semibold text-[64px] leading-[48px]">{elem.value}</h1>
                <h3 className="text-[12px] text-text_black_secondary">{elem.key}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Interest */}
      </div>
      <div className="flex flex-col gap-[10px] font-semibold text-[18px]">
        <a
          href="https://iidl.unist.ac.kr/Profiles/index.html"
          target="_blank"
          className="place-content-center border-2 border-primary_main active:border-primary_main grid active:bg-primary_main border-solid rounded-[15px] w-full h-[50px] text-primary_main active:text-white no-underline"
        >
          CV
        </a>
        <a
          className="place-content-center border-2 border-primary_main active:border-primary_main grid active:bg-primary_main border-solid rounded-[15px] w-full h-[50px] text-primary_main active:text-white no-underline"
          href="#contact"
        >
          Contact
        </a>
      </div>
    </div>
  );
};
