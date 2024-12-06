import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AppHeader, FormField, FormFieldMessages, Label, Modal, NumberInput, Overlay, TextInput, useMergeRefs, useOverlayWithTrigger } from "@dynatrace/strato-components-preview";
import { Button, Container, Flex, Heading, Text } from "@dynatrace/strato-components"
import { DeleteIcon, HomeIcon, PlusIcon, SettingIcon } from "@dynatrace/strato-icons";
import { useDocContext } from "./DocProvider";

export const Header = () => {
  const [ state, setState ] = useState(false);
  const { docContent, docData, setDocContent, updateDocContent } = useDocContext();
  const {
    targetRef,
    triggerRef,
    overlayRef,
    overlayState,
    overlayProps,
    overlayTriggerProps,
  } = useOverlayWithTrigger({
    placement: 'bottom-start',
    offset: 8,
  });
  const rootRef = useMergeRefs([triggerRef, targetRef]);
  console.log(docData)
  const [formData, setFormData] = useState({
    cycle: '',
    run: '',
    "Failure Rate": null,
    "Response Time": null,
    "CPU Usage": null,
    "Memory Usage": null,
  });

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

  const handleNewItemChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    setDocContent((prevState) => {
      // Check if an item with the same cycle and run already exists
      const existingItemIndex = prevState.findIndex(
        (item) => item.cycle === formData.cycle && item.run === formData.run
      );
  
      if (existingItemIndex !== -1) {
        // Update the existing item, replacing the entire criteria
        const updatedList = [...prevState];
        updatedList[existingItemIndex] = {
          ...updatedList[existingItemIndex],
          criteria: {
            // Replace the criteria entirely with the new values
            "Failure Rate": formData["Failure Rate"],
            "Response Time": formData["Response Time"],
            "CPU Usage": formData["CPU Usage"],
            "Memory Usage": formData["Memory Usage"],
          },
        };
        return updatedList;
      } else {
        // Add a new item if not found
        return [
          ...prevState,
          {
            cycle: formData.cycle,
            run: formData.run,
            criteria: {
              "Failure Rate": formData["Failure Rate"],
              "Response Time": formData["Response Time"],
              "CPU Usage": formData["CPU Usage"],
              "Memory Usage": formData["Memory Usage"],
            },
          },
        ];
      }
    });
  
    // Reset form data
    setFormData({
      cycle: '',
      run: '',
      "Failure Rate": null,
      "Response Time": null,
      "CPU Usage": null,
      "Memory Usage": null,
    });
  };

  const handleDelete = (cycleToDelete: string, runToDelete: string) => {
    setDocContent((prevState) => 
      prevState.filter(
        (item) => item.cycle !== cycleToDelete || item.run !== runToDelete
      )
    );
  };  

  const fields = [
    { label: 'Cycle', key: 'cycle', type: 'text', placeholder: 'Enter cycle' },
    { label: 'Run', key: 'run', type: 'text', placeholder: 'Enter run' },
    { label: 'Failure Rate', key: 'failureRate', type: 'number', placeholder: 'Enter target' },
    { label: 'Response Time', key: 'responseTime', type: 'number', placeholder: 'Enter target' },
    { label: 'CPU Usage', key: 'cpuUsage', type: 'number', placeholder: 'Enter target' },
    { label: 'Memory Usage', key: 'memoryUsage', type: 'number', placeholder: 'Enter target' },
  ];

  return (
    <>
      <AppHeader>
        <AppHeader.NavItems>
          <AppHeader.AppNavLink appName="Dashboard" as={Link} to="/"/>
          <AppHeader.NavItem as={Link} to="/CycleRun">
            Cycle & Run
          </AppHeader.NavItem>
        </AppHeader.NavItems>
        <AppHeader.ActionItems>
          <AppHeader.ActionButton
            prefixIcon={<SettingIcon />}
            onClick={() => setState(true)}
          >
            Criteria List
          </AppHeader.ActionButton>
        </AppHeader.ActionItems>
      </AppHeader>
      <Modal title={"Success Criteria List"} show={state} onDismiss={() => {setState(false); updateDocContent();}} size="large">
        <Flex flexDirection="row" justifyContent="end" gap={16} alignItems="center">
          <Text>Last Updated: {docData?.modificationInfo?.lastModifiedTime.toLocaleString()}</Text>
          <Button ref={rootRef} {...overlayTriggerProps} variant="emphasized">
            <PlusIcon /> Add New Criteria
          </Button>
          <Overlay
            ref={overlayRef}
            isOpen={overlayState.isOpen}
            overlayProps={overlayProps}
          >
            <Flex padding={8} flexDirection="column">
              {fields.map(({ label, key, type, placeholder }, index) => (
                <FormField required key={index}>
                  <Flex alignItems="center" justifyContent="space-between">
                    <Label>{label}</Label>
                    {type === 'text' ? (
                      <TextInput
                        value={formData[key]}
                        onChange={(e) => handleNewItemChange(key, e)}
                        placeholder={placeholder}
                        required
                      />
                    ) : (
                      <NumberInput
                        value={formData[label]}
                        onChange={(e) => handleNewItemChange(label, Number(e))}
                        placeholder={placeholder}
                        required
                      />
                    )}
                  </Flex>
                  <FormFieldMessages />
                </FormField>
              ))}
              <Button onClick={() => handleSubmit()}>Add</Button>
            </Flex>
          </Overlay>
        </Flex>
        <Flex flexWrap="wrap" gap={16} width={"100%"}>
          {docContent.map((item) => (
            <Flex flexDirection="column" width={"24%"}>
                <Flex justifyContent="space-between" alignItems="center">
                  <Heading level={6}>Cycle|Run: {item.cycle}|{item.run}</Heading>
                  {item.cycle !== 'dafault' && item.run !== 'default' ? 
                  <Button onClick={() => handleDelete(item.cycle, item.run)}><DeleteIcon/></Button> : undefined}
                </Flex>
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
