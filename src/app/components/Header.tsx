import React, {useContext, useState} from "react";
import { Link } from "react-router-dom";
import { AppHeader, Modal } from "@dynatrace/strato-components-preview";
// import { SuccessCriteriaContext } from "./SuccessCriteriaContext";

export const Header = () => {
  const [state, setState] = useState(false);

  // const {successCriteriaList, addCriteria} = useContext(SuccessCriteriaContext);
  
  return (
    <>
      <AppHeader>
        <AppHeader.NavItems>
          <AppHeader.AppNavLink as={Link} to="/" />
          <AppHeader.NavItem onClick={() => setState(true)}>
            Settings
          </AppHeader.NavItem>
        </AppHeader.NavItems>
      </AppHeader>
      <Modal title={"Success Criteria List"} show={state} onDismiss={() => setState(false)}>
        {/* {successCriteriaList} */}
      </Modal>
    </>
  );
};
