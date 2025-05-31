import React, { useState } from 'react';
import { Modal, Button, message } from 'antd';
import { deleteCategory } from '../services/categoryService';

interface DeleteCategoryModalProps {
  categoryId: string;
  categoryName: string;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
  categoryId,
  categoryName,
  visible,
  onClose,
  onSuccess
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteCategory(categoryId);
      message.success('Catégorie supprimée avec succès');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error deleting category:', error);
      message.error('Erreur lors de la suppression de la catégorie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Supprimer la catégorie"
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
        Êtes-vous sûr de vouloir supprimer la catégorie "{categoryName}" ?
        Cette action est irréversible.
      </p>
    </Modal>
  );
};

export default DeleteCategoryModal; 