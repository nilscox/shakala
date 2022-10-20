import { changeProfileImage } from 'frontend-domain';
import { ComponentProps, FormEventHandler, useRef } from 'react';

import { Button, SubmitButton } from '~/components/elements/button';
import { FormField } from '~/components/elements/form-field';
import { Input } from '~/components/elements/input';
import { TextAreaAutoResize } from '~/components/elements/textarea-autoresize';
import { useDispatch } from '~/hooks/use-dispatch';
import { useUser } from '~/hooks/use-user';
import { withPreventDefault } from '~/utils/with-prevent-default';

import { ProfileTitle } from './profile-title';

export const ProfileRoute = () => (
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

const ProfileFormField = (props: ComponentProps<typeof FormField>) => (
  <FormField consistentErrorHeight={false} className="col items-start gap-1" {...props} />
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
        <Input defaultValue={user?.nick} placeholder="pseudo" className="max-w-1" />
      </ProfileFormField>
    </form>
  );
};

const EmailForm = () => {
  const user = useUser();

  return (
    <form className="row" onSubmit={withPreventDefault(() => console.log('change email'))}>
      <ProfileFormField
        label="Adresse email"
        description="L'adresse que vous utilisez pour vous connecter"
        after={<SubmitButton secondary>Changer</SubmitButton>}
      >
        <Input defaultValue={user?.email} placeholder="votre@adresse.email" className="max-w-1" />
      </ProfileFormField>
    </form>
  );
};

const ProfileImageForm = () => {
  const dispatch = useDispatch();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    const form = new FormData(event.currentTarget);
    const image = form.get('profileImage') as File;

    dispatch(changeProfileImage(image));
  };

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  return (
    <form ref={formRef} onSubmit={withPreventDefault(handleSubmit)}>
      <ProfileFormField label="Image de profile">
        <Button primary className="bg-muted" onClick={() => inputRef.current?.click()}>
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
      <p className="text-xs text-muted">La première ligne sera affichée sous votre pseudo</p>

      <SubmitButton primary className="self-end bg-muted">
        Changer
      </SubmitButton>
    </form>
  );
};
