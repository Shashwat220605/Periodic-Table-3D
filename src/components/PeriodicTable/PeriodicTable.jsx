import ElementSphere from "./ElementSphere";

export default function PeriodicTable({
  element,
  onSelect,
}) {
  return (
    <ElementSphere
      element={element}
      onSelect={onSelect}
      featured
    />
  );
}