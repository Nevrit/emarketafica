import React, { useState } from 'react';
import { Modal, Button, message } from 'antd';
import { deleteProduct } from '../services/productService';

interface DeleteProductModalProps {
  productId: string;
  productName: string;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  productId,
  productName,
  visible,
  onClose,
  onSuccess
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteProduct(productId);
      message.success('Produit supprimé avec succès');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error deleting product:', error);
      message.error('Erreur lors de la suppression du produit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Supprimer le produit"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Annuler
        </Button>,
        <Button
          key="delete"
          type="primary"
          danger
          loading={loading}
          onClick={handleDelete}
        >
          Supprimer
        </Button>
      ]}
    >
      <p>
        Êtes-vous sûr de vouloir supprimer le produit "{productName}" ?
        Cette action est irréversible.
      </p>
    </Modal>
  );
};

export default DeleteProductModal; 