import styles from '@/styles/TextArea.module.css';

export default function TextArea(props) {
    return <textarea className={styles.textArea} {...props} />;
}
