export const Person = () => {
  return (
    <div className="person">
      <div className="person__title">director</div>
      <div className="person__info-box">
        <div className="person__img-box">{/* <img src="" alt="" className="person__img" /> */}</div>
        <div className="person__info">
          <h3 className="person__name">KwanMyung Kim</h3>
          <div className="person__degree">Professor</div>
          <div className="person__email">kmyung@unist.ac.kr </div>
          <div className="person__phone">+82-52-217-2714</div>
        </div>
        <div className="person__bio">
          Dr. KwanMyung Kim is a full professor in Department of Design and the director of Integration and Innovation Design Lab (IIDL). He was a Dean of Graduate School of Creative Design Engineering during 2016-2020.
          He serves as an editor for Archives of Design Research and ICONARP International Journal of Architecture and Planning. He is also a CEO of ID SPACE Corp., a start-up company that commercializes academic
          research outcomes. Before joining UNIST, he worked in industry for 14 years as a product designer/engineer. With his strong practical knowdge and experience he persues to integrate design and engineering, and
          industry and academic knowledge in the major IIDL's research domains including Design for Elderly, Rehabilitation and Health Care.
          <button className="person__bio-more">check for more</button>
        </div>
      </div>
    </div>
  );
};
