import MenuCard from "../MenuCard/MenuCard";
import "./MenuList.css";

function MenuList({ menuItems }) {
  return (
    <div className="menu-list">
      {menuItems.map((menuItem) => (
        <MenuCard key={menuItem.id} menuItem={menuItem} />
      ))}
    </div>
  );
}

export default MenuList;
