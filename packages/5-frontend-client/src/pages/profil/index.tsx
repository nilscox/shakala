import { userProfileActions } from 'frontend-domain';
import { FormEventHandler, useRef } from 'react';

import { ProfileTitle } from '~/app/profile/profile-title';
import { Button, SubmitButton } from '~/elements/button';
import { FormField } from '~/elements/form-field';
import { Input } from '~/elements/input';
import { TextAreaAutoResize } from '~/elements/textarea-autoresize';
import { useAppDispatch } from '~/hooks/use-app-dispatch';
import { useUser } from '~/hooks/use-user';
import { ssr } from '~/utils/ssr';
import { withPreventDefault } from '~/utils/with-prevent-default';

export const getServerSideProps = ssr.authenticated();

const ProfilePage = () => (
  <>
    <ProfileTitle title="Profil" subTitle="Éditez les informations liées à votre profil sur Shakala" />

    <div className="col gap-6">
      <NickForm />
      <EmailForm />
      <ProfileImageForm />
      <BioForm />
    </div>
  </>
);

export default ProfilePage;

const ProfileFormField = (props: React.ComponentProps<typeof FormField>) => (
  <FormField consistentErrorHeight={false} className="col gap-1" {...props} />
);

const NickForm = () => {
  const user = useUser();

  return (
    <form onSubmit={() => console.log('change nick')}>
      <ProfileFormField
        label="Votre pseudo"
        description="Le nom sous lequel vous apparaissez"
        after={<SubmitButton secondary>Changer</SubmitButton>}
      >
        <Input defaultValue={user?.nick} placeholder="pseudo" className="flex-1 max-w-1" />
      </ProfileFormField>
    </form>
  );
};

const EmailForm = () => {
  const user = useUser();

  return (
    <form onSubmit={withPreventDefault(() => console.log('change email'))}>
      <ProfileFormField
        label="Adresse email"
        description="L'adresse que vous utilisez pour vous connecter"
        after={<SubmitButton secondary>Changer</SubmitButton>}
      >
        <Input defaultValue={user?.email} placeholder="votre@adresse.email" className="flex-1 max-w-1" />
      </ProfileFormField>
    </form>
  );
};

const ProfileImageForm = () => {
  const dispatch = useAppDispatch();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    const form = new FormData(event.currentTarget);
    const image = form.get('profileImage') as File;

    dispatch(userProfileActions.changeProfileImage(image));
  };

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  return (
    <form ref={formRef} onSubmit={withPreventDefault(handleSubmit)}>
      <ProfileFormField label="Image de profile">
        <Button primary className="bg-muted self-start" onClick={() => inputRef.current?.click()}>
          Choisir un fichier...
        </Button>
      </ProfileFormField>

      <input
        ref={inputRef}
        type="file"
        name="profileImage"
        className="hidden"
        onChange={() => submitRef.current?.click()}
      />

      <button ref={submitRef} type="submit" className="hidden" />
    </form>
  );
};

const BioForm = () => {
  return (
    <form className="col" onSubmit={withPreventDefault(() => console.log('change bio'))}>
      <ProfileFormField label="Bio" description="Quelques mots à propos de vous, visible publiquement">
        <TextAreaAutoResize rows={3} className="w-full rounded border p-1" />
      </ProfileFormField>

      <p className="text-xs text-muted my-0">La première ligne sera affichée sous votre pseudo</p>

      <SubmitButton primary className="self-end bg-muted">
        Changer
      </SubmitButton>
    </form>
  );
};
