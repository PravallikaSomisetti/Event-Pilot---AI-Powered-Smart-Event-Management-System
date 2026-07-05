function Button({
  children,
  onClick,
  variant = "primary",
}) {
  const styles = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white",

    secondary:
      "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`px-7 py-3 rounded-xl font-semibold transition ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

export default Button;