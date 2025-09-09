
import React, { useContext, useEffect, useState } from "react";
import { ProductContext } from "../context/ProductContext";
import { useToast } from "../context/ToastContext";
import "../scss/pages/_alta.scss";

const initialForm = {
  id: "",
  nombre: "",
  descripcionCorta: "",
  descripcionLarga: "",
  categoria: "",
  subcategoria: "",
  precio: "",
  stock: "",
  marca: "",
  envioGratis: false,
  edadDesde: "",
  edadHasta: "",
  foto: "",
};

const Alta = () => {
  const { products, createProduct, updateProduct, deleteProduct } =
    useContext(ProductContext);
  const { showToast } = useToast();

  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("formAlta");
    return saved ? JSON.parse(saved) : initialForm;
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("formAlta", JSON.stringify(form));
  }, [form]);

  const validateField = (name, value) => {
    switch (name) {
      case "nombre":
        if (!value || !String(value).trim()) return "El nombre es obligatorio";
        break;
      case "descripcionCorta":
        if (!value || !String(value).trim())
          return "La descripción corta es obligatoria";
        break;
      case "precio":
        if (value === "" || isNaN(value) || Number(value) <= 0)
          return "Debe ser un número positivo";
        break;
      case "stock":
        if (value !== "" && (isNaN(value) || Number(value) < 0))
          return "Debe ser 0 o más";
        break;
      case "categoria":
        if (!value || !String(value).trim())
          return "La categoría es obligatoria";
        break;
      case "foto":
        if (
          value &&
          !/^https?:\/\/.+\.(jpg|jpeg|png|gif|bmp|webp)$/.test(value)
        )
          return "Debe ser una URL válida de imagen";
        break;
      default:
        return "";
    }
    return "";
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    const error = validateField(name, val);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (product) => {
    setForm({
      id: product.id || product._id || "",
      nombre: product.nombre || "",
      descripcionCorta: product.descripcionCorta || "",
      descripcionLarga: product.descripcionLarga || "",
      categoria: product.categoria || "",
      subcategoria: product.subcategoria || "",
      precio: product.precio ?? "",
      stock: product.stock ?? "",
      marca: product.marca || "",
      envioGratis: product.envioGratis || false,
      edadDesde: product.edadDesde ?? "",
      edadHasta: product.edadHasta ?? "",
      foto: product.foto || "",
    });
    setIsEditing(true);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.entries(form).forEach(([key, val]) => {
      const err = validateField(key, val);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showToast("Por favor corrige los errores antes de enviar", "error");
      return;
    }

    setLoading(true);
    const payload = {
      nombre: form.nombre,
      descripcionCorta: form.descripcionCorta,
      descripcionLarga: form.descripcionLarga,
      categoria: form.categoria,
      subcategoria: form.subcategoria,
      precio: Number(form.precio),
      stock: form.stock === "" ? 0 : Number(form.stock),
      marca: form.marca,
      envioGratis: Boolean(form.envioGratis),
      edadDesde: form.edadDesde === "" ? null : Number(form.edadDesde),
      edadHasta: form.edadHasta === "" ? null : Number(form.edadHasta),
      foto: form.foto,
    };

    try {
      if (isEditing && form.id) {
        await updateProduct(form.id, payload);
        showToast("Producto actualizado con éxito", "success");
      } else {
        await createProduct(payload);
        showToast("Producto agregado con éxito", "success");
      }

      setForm(initialForm);
      setIsEditing(false);
      setErrors({});
      localStorage.removeItem("formAlta");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Error al guardar producto", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="alta-container">
      <h1>{isEditing ? "Editar Producto" : "Alta de Producto"}</h1>

      <form onSubmit={handleSubmit} noValidate className="alta-form">
        {[
          { label: "Nombre", name: "nombre" },
          { label: "Descripción corta", name: "descripcionCorta" },
          { label: "Descripción larga", name: "descripcionLarga", isTextArea: true },
          { label: "Categoría", name: "categoria" },
          { label: "Subcategoría", name: "subcategoria" },
          { label: "Precio", name: "precio", type: "number" },
          { label: "Stock", name: "stock", type: "number" },
          { label: "Marca", name: "marca" },
          { label: "Edad desde", name: "edadDesde", type: "number" },
          { label: "Edad hasta", name: "edadHasta", type: "number" },
          { label: "Foto (URL)", name: "foto" },
        ].map(({ label, name, type = "text", isTextArea }) => (
          <label key={name}>
            {label}:
            {isTextArea ? (
              <textarea
                name={name}
                value={form[name]}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            ) : (
              <input
                name={name}
                type={type}
                value={form[name]}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            )}
            {errors[name] && <span className="error">{errors[name]}</span>}
          </label>
        ))}

        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            name="envioGratis"
            type="checkbox"
            checked={form.envioGratis}
            onChange={handleChange}
          />
          Envío gratis
        </label>

        {form.foto &&
          /^https?:\/\/.+\.(jpg|jpeg|png|gif|bmp|webp)$/.test(form.foto) && (
            <div className="preview-image">
              <img src={form.foto} alt="Preview" style={{ maxWidth: 200 }} />
            </div>
          )}

        <button type="submit" disabled={loading}>
          {loading
            ? "Enviando..."
            : isEditing
            ? "Actualizar Producto"
            : "Agregar Producto"}
        </button>
      </form>

      <h2>Productos actuales</h2>
      <ul className="product-list">
        {products.map((prod) => (
          <li key={prod.id}>
            <strong>{prod.nombre}</strong> - ${prod.precio}
            <button onClick={() => handleEdit(prod)} title="Editar producto">
              Editar
            </button>
            <button
              onClick={async () => {
                if (confirm("¿Eliminar producto?")) {
                  try {
                    await deleteProduct(prod.id);
                    showToast("Producto eliminado", "success");
                  } catch {
                    showToast("Error al eliminar", "error");
                  }
                }
              }}
              title="Eliminar producto"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Alta;
