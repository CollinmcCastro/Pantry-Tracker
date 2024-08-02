'use client'
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Button, Modal, Stack, TextField, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from "firebase/firestore";
import React from 'react';


export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [quantityToAdd, setQuantityToAdd] = useState(1);
  const [quantityToRemove, setQuantityToRemove] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMethod, setSortMethod] = useState('alphabetical');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data()
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item, quantity = 1) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity: currentQuantity } = docSnap.data();
      await setDoc(docRef, { quantity: currentQuantity + quantity });
    } else {
      await setDoc(docRef, { quantity });
    }
    await updateInventory();
  };

  const removeItem = async (item, quantity = 1) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity: currentQuantity } = docSnap.data();
      if (currentQuantity <= quantity) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: currentQuantity - quantity });
      }
    }
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleAddModalOpen = (item) => {
    setSelectedItem(item);
    setQuantityToAdd(1);
    setAddModalOpen(true);
  };
  const handleAddModalClose = () => setAddModalOpen(false);
  const handleRemoveModalOpen = (item) => {
    setSelectedItem(item);
    setQuantityToRemove(1);
    setRemoveModalOpen(true);
  };
  const handleRemoveModalClose = () => setRemoveModalOpen(false);

  useEffect(() => {
    updateInventory();
  }, []);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedInventory = [...filteredInventory].sort((a, b) => {
    if (sortMethod === 'alphabetical') {
      return a.name.localeCompare(b.name);
    } else if (sortMethod === 'highestQuantity') {
      return b.quantity - a.quantity;
    } else if (sortMethod === 'lowestQuantity') {
      return a.quantity - b.quantity;
    }
    return 0;
  });

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Modal open={addModalOpen} onClose={handleAddModalClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6">Add amount to {selectedItem}</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button variant="outlined" onClick={() => setQuantityToAdd(quantityToAdd - 1)} disabled={quantityToAdd <= 1}>-</Button>
            <TextField
              type="number"
              value={quantityToAdd}
              onChange={(e) => setQuantityToAdd(parseInt(e.target.value))}
              inputProps={{ min: 1 }}
              sx={{ width: 100 }}
            />
            <Button variant="outlined" onClick={() => setQuantityToAdd(quantityToAdd + 1)}>+</Button>
          </Stack>
          <Button
            variant="contained"
            onClick={() => {
              addItem(selectedItem, quantityToAdd);
              handleAddModalClose();
            }}
          >
            Add
          </Button>
        </Box>
      </Modal>
      <Modal open={removeModalOpen} onClose={handleRemoveModalClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6">Remove amount from {selectedItem}</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button variant="outlined" onClick={() => setQuantityToRemove(quantityToRemove - 1)} disabled={quantityToRemove <= 1}>-</Button>
            <TextField
              type="number"
              value={quantityToRemove}
              onChange={(e) => setQuantityToRemove(parseInt(e.target.value))}
              inputProps={{ min: 1 }}
              sx={{ width: 100 }}
            />
            <Button variant="outlined" onClick={() => setQuantityToRemove(quantityToRemove + 1)}>+</Button>
          </Stack>
          <Button
            variant="contained"
            onClick={() => {
              removeItem(selectedItem, quantityToRemove);
              handleRemoveModalClose();
            }}
          >
            Remove
          </Button>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={() => {
          handleOpen();
        }}
      >
        Add New Item
      </Button>
      <TextField
        variant='outlined'
        placeholder='Search items'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ width: '50%', marginBottom: 2 }}
      />
      <FormControl variant="outlined" sx={{ width: '50%', marginBottom: 2 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortMethod}
          onChange={(e) => setSortMethod(e.target.value)}
          label="Sort By"
        >
          <MenuItem value="alphabetical">Alphabetical</MenuItem>
          <MenuItem value="highestQuantity">Highest Quantity</MenuItem>
          <MenuItem value="lowestQuantity">Lowest Quantity</MenuItem>
        </Select>
      </FormControl>
      <Box border="1px solid #333" width="800px" height="600px" overflow="auto">
        <Box
          width="100%"
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant='h2' color='#333'>
            Inventory Items
          </Typography>
        </Box>

        <Stack width="100%" spacing={2} padding={2}>
          {sortedInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding={2}
              boxShadow={1}
              borderRadius={1}
            >
              <Typography variant="h6" color="#333" textAlign="center" flex={1}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h6" color="#333" textAlign="center" flex={1}>
                {quantity}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  onClick={() => {
                    handleAddModalOpen(name);
                  }}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    handleRemoveModalOpen(name);
                  }}
                >
                  Remove XXX
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  
    
  );
    
}