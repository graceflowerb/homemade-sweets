import { Suspense } from "react";
import EditProductForm from "./EditProductForm";

// Generates dynamic params for prerendering without failing build workers..
export async function generateStaticParams() {
  return [];
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;

  return (
    <Suspense
      fallback={
        <div className="py-20 text-center font-sans text-neutral-500">
          Loading editor...
        </div>
      }
    >
      <EditProductForm productId={resolvedParams.id} />
    </Suspense>
  );
}
