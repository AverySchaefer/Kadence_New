import styles from '@/styles/Button.module.css';

export default function Button(props) {
    return (
        <button className={styles.button} {...props}>
            {props.children}
        </button>
    );
}
