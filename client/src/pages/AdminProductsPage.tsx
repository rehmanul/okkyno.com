import { useRoute } from "wouter";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductForm from "@/components/admin/ProductForm";

export default function AdminProductsPage() {
  // Route matching for edit view
  const [editMatch, editParams] = useRoute("/admin/products/edit/:id");

  // If we're on the edit route, render the ProductForm with the product ID
  if (editMatch && editParams?.id) {
    const productId = parseInt(editParams.id);
    if (isNaN(productId)) {
      return (
        <AdminLayout title="Error">
          <div className="p-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Product ID</h1>
              <p>The product ID provided is not valid.</p>
            </div>
          </div>
        </AdminLayout>
      );
    }
    return (
      <AdminLayout title="Edit Product">
        <ProductForm productId={productId} />
      </AdminLayout>
    );
  }

  // Default: redirect to the main products page
  // This shouldn't happen as we have separate routes, but just in case
  window.location.href = '/admin/products';
  return null;
}