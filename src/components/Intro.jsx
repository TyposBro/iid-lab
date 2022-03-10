// Redeploy

import img from "../img.json";

export const Intro = () => {
  const { creative, logo } = img.HOME.INTRO;
  return (
    <div className="intro">
      <div className="intro__row intro__row--1">
        <div className="intro__img-container intro__img-container--1">
          <img src={`/img/home/intro/${creative}`} className="intro__img intro__img--1" alt="" />
        </div>

        <div className="intro__block intro__block--1">
          <p className="intro__paragraph intro__paragraph--1">
            Integration + Innovation Design Lab focuses on design and development of innovative products and services by integrating Design, Ergonomics, Engineering, Technology and Entrepreneurship. We don't want our
            research results to remain only as conceptual design. We aim to commercialize them into actual products and services so that they can be used by people.
          </p>
          <p className="intro__paragraph intro__paragraph--1">
            We create innovative design concepts by applying systematic and human-centered design methods, and develop them as products-services using engineering design methods. In particular, we have been actively
            researching and developing product and services related to elderly care, rehabilitation, healthcare and safety. We have been actively collaborating with various experts such as medical doctors, geriatric
            experts, physical exercise trainner, rehabilitation therapists, material experts, production engineers and etc.
          </p>
          <p className="intro__paragraph intro__paragraph--1">
            We have published world-class research papers and have been awarded world-class design awards. In addition, the students who were engaged in the research projects gained the integrated knowledge and
            experience necessary to lead new product development, and have been continueing successful careers after graduation.
          </p>
        </div>
      </div>

      <div className="intro__row intro__row--2">
        <div className="intro__block intro__block--2">
          <h2>RESEARCH PHILOSOPHY</h2>
          <p className="intro__paragraph intro__paragraph--2">
            <span className="intro__paragraph--strong">[ Multidisciplinary and Integrative ]</span> The new product development team consists of experts from various fields. To enable design-led new product development,
            designers must be able to understand knowledge in various fields and lead the new product development team.
          </p>
          <p className="intro__paragraph intro__paragraph--2">
            To this end, we generate innovative design concepts using Human-centeric methods with science and technology, and implement and verify design results into actual products using ergonomics and engineering
            design methods. And we seek ways to commercialize designs through entrepreneurship.
          </p>
          <p className="intro__paragraph intro__paragraph--2">
            <span className="intro__paragraph--strong">[ Grounded in 'Seek Truth from Facts' and Pragmatism ]</span> Our research always begins with design projects based on practical needs, and the results always end
            with practical contributions. Accordingly, our research achievements include not only paper publicaiton and award-winning but also commercialization of new products and services for actual use.
          </p>
        </div>
        <div className="intro__img-container intro__img-container--2">
          <img className="intro__img intro__img--2" src={`/img/home/intro/${logo}`} alt="" />
        </div>
      </div>
    </div>
  );
};
