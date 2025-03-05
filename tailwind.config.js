/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}"],
  presets: [
    require("nativewind/preset"),
    "nativewind/babel"
    // require("nativewind/babel")
  ],
  theme: {
    extend: {
      colors:{
        white: "#FFFFFF",
        black : "#1D1617",
        offwhite : "#F7F8F8",
        light_green : "BFFF80",
        primarygray : "#7B6F72",
      },
      textColor : {
        primarygreen : "#7EBB16",
        primarygray : "#7B6F72",
        primaryOrange : '#F8AC7D'
      },
      borderColor:{
        primarygray : "#7B6F72"
      },
      fontFamily : {
        "Popping" : ['Poppins-Regular','sans-serif'],
        "Popping-Bold" : ['Poppins-Bold','sans-serif'],
        "Popping-ExtraBold" : ['Poppins-ExtraBold','sans-serif'],
        "Popping-SemiBold" : ['Poppins-SemiBold','sans-serif'],
        "Popping-SemiLight" : ['Poppins-SemiLight','sans-serif'],
        "Popping-Light" : ['Poppins-Light','sans-serif'],
        "Popping-thin" : ['Poppins-Thin','sans-serif'],
      },
      backgroundImage: {
        "green-gradient": "linear-gradient(to right, #BFFF80, #99D741 , #7EBB16)",
        "orange-gradient" : "linear-gradient(to right,#FBC5C5, #F8AC7D)"
      },
    },
  },
  plugins: [],
}