import classes from "./PageContainer.module.css";

function PageContainer({ children, width = "100%" }) {
  return (
    <div className={classes.container} style={{ width }}>
      {children}
    </div>
  );
}

export default PageContainer;
