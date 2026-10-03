import { productsSubnav } from "@/content/products";

// Server Component: plain in-page links, so it works without JavaScript.
export function ProductsSubnav() {
  return (
    <nav className="subnav" aria-label={productsSubnav.label}>
      <div className="wrap">
        {productsSubnav.items.map((item) => (
          <a key={item.id} href={`#${item.id}`}>
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
