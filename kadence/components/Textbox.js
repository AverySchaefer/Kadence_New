import styles from '@/styles/Textbox.module.css';

export default function Textbox({ name, placeholder = '', password = false }) {
  return (
    <input
      className={styles.textInput}
      type={password ? 'password' : 'text'}
      name={name}
      placeholder={placeholder}
    />
  );
}
