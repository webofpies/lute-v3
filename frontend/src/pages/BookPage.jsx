import { useState } from "react";
import Book from "@book/components/Book/Book";
import DrawerMenu from "../components/DrawerMenu/DrawerMenu";

function BookPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [themeFormOpen, setThemeFormOpen] = useState(false);

  return (
    <>
      <DrawerMenu
        drawerOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onThemeFormOpen={setThemeFormOpen}
      />
      <Book
        themeFormOpen={themeFormOpen}
        onDrawerOpen={() => setDrawerOpen(true)}
        onThemeFormOpen={setThemeFormOpen}
      />
    </>
  );
}

export default BookPage;
