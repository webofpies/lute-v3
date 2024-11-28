import classes from "./PageContainer.module.css";

function PageContainer({ children }) {
  return <div className={classes.container}>{children}</div>;
}

export default PageContainer;
