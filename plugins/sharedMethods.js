import { useStatesStore } from '~~/store/states';
import { jsPDF } from 'jspdf';

export default defineNuxtPlugin(async nuxtApp => {
    const store = useStatesStore();

    return {
        provide: {
            openModal(modal) {
                store.openModal(modal);
            },

            closeModal() {
                store.closeModal();
            },

            isActiveModal() {
                return !!store.activeModal;
            },

            isOpenModal(modal) {
                return store.activeModal === modal;
            },

            createPdf(text) {
                const doc = new jsPDF();
                const pageHeight = doc.internal.pageSize.height;
                const wrappedText = doc.splitTextToSize(text.trim(), 180);
                doc.setFontSize(14);
                let iterations = 1; // we need control the iterations of line
                const margin = 15; //top and botton margin in mm
                const defaultYJump = 5; // default space btw lines

                wrappedText.forEach((line) => {
                    let posY = margin + defaultYJump * iterations++;
                    if (posY > pageHeight - margin) {
                        doc.addPage();
                        iterations = 1;
                        posY = margin + defaultYJump * iterations++;
                    }
                    doc.text(15, posY, line);
                });

                return doc;
            },

            text2html(html) {
                if (!html)
                    return '';

                // converts HTML to text, TODO: implement rich text editor or for more advanced convertion https://www.npmjs.com/package/html-to-text
                return new DOMParser().parseFromString(html, "text/html").documentElement.textContent || '';
            }
        }
    }
});
