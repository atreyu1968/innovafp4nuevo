#!/usr/bin/env node

import { manualUpdate } from '../utils/update';

const update = async () => {
  try {
    console.log('Verificando actualizaciones...');
    const updated = await manualUpdate();
    
    if (updated) {
      console.log('Sistema actualizado correctamente');
    } else {
      console.log('El sistema ya está actualizado');
    }
  } catch (error) {
    console.error('Error al actualizar:', error);
    process.exit(1);
  }
};

update();