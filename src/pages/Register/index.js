import React from 'react';
import {useState} from 'react';
import {showMessage} from 'react-native-flash-message';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Header, Input, Button, Gap, Loading} from '../../components';
import {Fire} from '../../config';
import {colors, storeData, useForm} from '../../utils';

const Register = ({navigation}) => {
  const [form, setForm] = useForm({
    fullName: '',
    profession: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const onContinue = () => {
    setLoading(true);

    Fire.auth()
      .createUserWithEmailAndPassword(form.email, form.password)
      .then(success => {
        console.log('sending...');
        setLoading(false);
        const data = {
          fullName: form.fullName,
          profession: form.profession,
          email: form.email,
        };
        setForm('reset');
        Fire.database()
          .ref('users/' + success.user.uid)
          .set(data);

        storeData('user', data);
        navigation.navigate('UploadPhoto');
        console.log('register success: ', success);
      })
      .catch(error => {
        setLoading(false);
        const errorMessage = error.message;
        showMessage({
          message: errorMessage,
          type: 'default',
          backgroundColor: colors.error,
          color: colors.white,
        });
        console.log('error register: ', errorMessage);
      });
  };

  return (
    <>
      <View style={styles.page}>
        <Header title="Daftar Akun" onPress={() => navigation.goBack()} />
        <View style={styles.content}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Input
              label="Full Name"
              value={form.fullName}
              onChangeText={value => setForm('fullName', value)}
            />
            <Gap height={24} />
            <Input
              label="Pekerjaan"
              value={form.profession}
              onChangeText={value => setForm('profession', value)}
            />
            <Gap height={24} />
            <Input
              label="Email"
              value={form.email}
              onChangeText={value => setForm('email', value)}
            />
            <Gap height={24} />
            <Input
              label="Password"
              value={form.password}
              onChangeText={value => setForm('password', value)}
              secureTextEntry
            />
            <Gap height={40} />
            <Button title="Continue" onPress={onContinue} />
          </ScrollView>
        </View>
      </View>
      {loading && <Loading />}
    </>
  );
};

export default Register;

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.white,
    flex: 1,
  },
  content: {
    padding: 40,
    paddingTop: 0,
  },
});
