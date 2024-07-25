import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Order, Product } from '../api/orders.api';

const getImageBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject('Failed to convert image to base64');
      }
    };
    reader.onerror = () => reject('Error reading image file');
    reader.readAsDataURL(blob);
  });
};

export const generateInvoice = async (order: Order, products: Product[],  computeOrderTotal: () => string) => {
  const doc = new jsPDF();

  const imageUrl = 'https://i.ibb.co/6XykWVr/Pe-SVn-TQQru-YYlk-X9-XEYAg.jpg';
  const imageBase64 = await getImageBase64(imageUrl);

  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.addImage(imageBase64, 'JPEG', 14, 15, 50, 20);
  doc.text('Facture', 14, 55);

  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text(`N° de commande: ${order.orderNumber}`, 14, 65);
  doc.text(
    `Date de commande: ${new Date(order.createdAt).toLocaleDateString('fr-FR')}`,
    14,
    71
  );

  doc.setFontSize(12);
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text('Fanthésie', 14, 90);
  doc.text('123 Rue du Thé, 75001 Paris', 14, 100);
  doc.text('France', 14, 110);
  doc.text('contact@fanthesie.fr', 14, 120);
  doc.text('01 23 45 67 89', 14, 130);

  doc.setFontSize(12);
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text(`${order.address.firstName} ${order.address.lastName}`, 113, 140);
  doc.text(
    `${order.address.street}, ${order.address.zipCode} ${order.address.city}`,
    113,
    150
  );
  doc.text(`${order.address.phone}`, 113, 160);

  const itemRows = order.items.map((item) => {
    const product = products.find((p) => p.id === item.id);
    return [product?.name || 'Unknown Product', item.quantity || 1, `${item.price} €`];
  });

  autoTable(doc, {
    startY: 175,
    head: [['Produit', 'Quantité', 'Prix']],
    body: itemRows,
    theme: 'striped',
    headStyles: {
      fillColor: [56, 101, 74],
      textColor: 255,
      fontSize: 12
    },
    bodyStyles: {
      fillColor: [245, 245, 245],
      textColor: [50, 50, 50],
      fontSize: 10
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255]
    },
    styles: {
      lineWidth: 0.1,
      lineColor: [200, 200, 200]
    }
  });

  doc.setFontSize(12);
  //@ts-ignore
  const finalY = doc.lastAutoTable.finalY || 120 + order.value.items.length * 6;
  doc.text(`Sous-total: ${computeOrderTotal()} €`, 143, finalY + 10);
  doc.text(`Livraison: 8 €`, 143, finalY + 18);
  doc.text(`Remise: 0 €`, 143, finalY + 26);
  doc.text(`Total TTC: ${(parseFloat(computeOrderTotal()) + 8).toFixed(2)} €`, 143, finalY + 34);

  doc.save(`Invoice_${order.orderNumber}.pdf`);
};
