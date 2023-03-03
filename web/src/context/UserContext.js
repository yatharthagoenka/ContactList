import React, { useContact } from "react";

const UserContext = React.createContext([{}, () => {}]);

let initialContact = {};

const UserProvider = (props) => {
  const [contact, setContact] = useContact(initialContact);

  return (
    <UserContext.Provider value={[contact, setContact]}>
      {props.children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };