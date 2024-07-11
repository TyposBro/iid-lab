// import { css } from "styled-components";

/*
! ******************************DISCLAIMER******************************
!THIS PROJECT USES MOBILE-FIRST APPROACH
!NO QUERRIES NEEDED FOR MOBILE
^ rems in html are NOT inherited, use em = 16px for queries instead

? @media queries
Reference breakpoints:
https://m3.material.io/foundations/layout/understanding-layout/overview
& 0-599px: Mobile  (MAIN)
* 600~904px: Tablet Portrait
* 905~1239px: Tablet Landscape
* 1240~1439px: Desktop
* 1440px+: Big Screen
*/

//Breakpoint value is from maximum width point of view (i.e. 37.5 em = 600 px = mobile's largest size)
//big screen is any value above desktop's breakpoint
// export const breakpoints = {
//   mobile: "37.5em",
//   tablet: "56.5em",
//   tabletLand: "77.5em",
//   desktop: "90em",
// };

export const breakpoints = {
  mobile: "599px",
  tablet: "904px",
  tabletLand: "1239px",
  desktop: "1439px",
  bigscreen: "1440px",
};

// export const responsive = Object.keys(breakpoints).reduce((accumulator, label) => {
//   accumulator[label] = (...args) => css`
//     @media (max-width: ${breakpoints[label]}) {
//       ${css(...args)};
//     }
//   `;
//   return accumulator;
// }, {});
