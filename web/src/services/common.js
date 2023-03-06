import { useLocation, useNavigate, useParams } from "react-router-dom";

export const API_URL = 'https://contactlist-production-c316.up.railway.app/';

export const withRouter = (Component) => {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return <Component {...props} router={{ location, navigate, params }} />;
  }
  return ComponentWithRouterProp;
};