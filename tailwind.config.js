module.exports = {
  important: true,
  content: ["./app/javascript/**/*.{js,jsx}", "./app/views/**/*.html.erb"],
  theme: {
    extend: {
      colors: {
        "custom-green": "#008068", // Now you can use text-custom-green
      },
    },
  },
};
