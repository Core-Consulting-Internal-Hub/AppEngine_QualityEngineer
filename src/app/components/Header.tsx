import React, { useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { AppHeader, Label, Modal, NumberInput } from "@dynatrace/strato-components-preview";
import { Button, Flex, Heading } from "@dynatrace/strato-components"
import { documentsClient } from "@dynatrace-sdk/client-document";
import { SettingIcon } from "@dynatrace/strato-icons";
import { useDocContext } from "./DocProvider";

export const Header = () => {
  const [state, setState] = useState(false);
  const { docContent, setDocContent, updateDocContent } = useDocContext();

  const handleChange = async (cycle: string, run: string, key: string, newValue: number) => {
    setDocContent((prevState) =>
      prevState.map((item) => {
        if (item.cycle === cycle && item.run === run) {
          return {
            ...item,
            criteria: {
              ...item.criteria,
              [key]: newValue, // Update the specific key in criteria
            },
          };
        }
        return item;
      })
    );
  };

  return (
    <>
      <AppHeader>
        <AppHeader.NavItems>
          <AppHeader.AppNavLink as={Link} to="/" />
          <AppHeader.NavItem onClick={() => setState(true)}>
            <SettingIcon /> Criteria List
          </AppHeader.NavItem>
        </AppHeader.NavItems>
      </AppHeader>
      <Modal title={"Success Criteria List"} show={state} onDismiss={() => {setState(false); updateDocContent();}}>
        <Flex flex={"wrap"}>
          {docContent.map((item) => (
            <Flex flexDirection="column">
              <Heading level={6}>Cycle|Run: {item.cycle}|{item.run}</Heading>
              {Object.entries(item.criteria).map(([key, value]) => {
                return (
                  <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Label>{key}:</Label>
                      <NumberInput value={Number(value)} onChange={e => handleChange(item.cycle, item.run, key, Number(e))}/>
                  </Flex>
                )
              })}
            </Flex>
          ))}
        </Flex>
      </Modal>
    </>
  );
};
