const FormField = ({ label, type="text", name, value, onChange, error }) => (
  <label>
    {label}
    {type === "textarea" ? (
      <textarea name={name} value={value} onChange={onChange} />
    ) : (
      <input type={type} name={name} value={value} onChange={onChange} />
    )}
    {error && <span className="error-text">{error}</span>}
  </label>
);
export default FormField;
