import styles from '@/styles/Textbox.module.css';

export default function Textbox(props) {
    return <input className={styles.textInput} {...props} />;
}
