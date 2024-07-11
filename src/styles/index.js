import { createGlobalStyle } from "styled-components";

import { reset } from "./reset";
import { theme } from "./theme";
export { default as typography } from "./typography";

export default createGlobalStyle`


//& RESET BROWSER DEFAULTS
${reset}
${theme}

`;
