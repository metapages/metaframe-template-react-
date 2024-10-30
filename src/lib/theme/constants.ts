export const headerHeightVal = 3; // chakra size val: 12
export const footerHeightVal = 3.5; // chakra size val: 14
export const panelHeightVal = 1.5; // chakra size val: 6

// 1px extra deduction for border weight
export const contentHeight = `calc(100vh - ${headerHeightVal + footerHeightVal}rem - 1px)`;
export const headerHeight = `${headerHeightVal}rem`;
export const footerHeight = `${footerHeightVal}rem - 0px`;
export const panelHeaderHeight = `${panelHeightVal}rem`;