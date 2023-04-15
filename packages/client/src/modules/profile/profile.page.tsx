import { defined } from '@shakala/shared';
import { FormEventHandler, useRef } from 'react';

import { Button, SubmitButton } from '~/elements/button';
import { FormField } from '~/elements/form-field';
import { Input } from '~/elements/input';
import { ExternalLink } from '~/elements/link';
import { useUser } from '~/hooks/use-user';
import { withPreventDefault } from '~/utils/with-prevent-default';

import { ProfileTitle } from './profile-title';

export { ProfileLayout as Layout } from './profile-layout';
export { ProfilePage as Page };
export const authenticationRequired = true;

const ProfilePage = () => (
  <>
    <ProfileTitle title="Votre profil" subTitle="Éditez les informations liées à votre profil sur Shakala" />

    <div className="col gap-6">
      <NickForm />
      <EmailForm />
      <ProfileImageForm />
      <BioForm />
    </div>
  </>
);

const ProfileFormField = (props: React.ComponentProps<typeof FormField>) => (
  <FormField consistentErrorHeight={false} className="col gap-1" {...props} />
);

const NickForm = () => {
  const user = defined(useUser());

  return (
    <form onSubmit={withPreventDefault(() => console.log('change nick'))}>
      <ProfileFormField
        name="nick"
        label="Votre pseudo"
        description="Le nom sous lequel vous apparaissez"
        after={<SubmitButton secondary>Changer</SubmitButton>}
      >
        <Input defaultValue={user.nick} placeholder="pseudo" className="max-w-1 flex-1" />
      </ProfileFormField>
    </form>
  );
};

const EmailForm = () => {
  const user = defined(useUser());

  return (
    <form onSubmit={withPreventDefault(() => console.log('change email'))}>
      <ProfileFormField
        name="email"
        label="Adresse email"
        description="L'adresse que vous utilisez pour vous connecter"
        after={<SubmitButton secondary>Changer</SubmitButton>}
      >
        <Input defaultValue={user.email} placeholder="votre@adresse.email" className="max-w-1 flex-1" />
      </ProfileFormField>
    </form>
  );
};

const ProfileImageForm = () => {
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    const form = new FormData(event.currentTarget);
    const image = form.get('profileImage') as File;

    // todo: profile image upload
    image;
  };

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  return (
    <form ref={formRef} onSubmit={withPreventDefault(handleSubmit)}>
      <ProfileFormField name="profile-image" label="Image de profile" className="hidden">
        <Button primary className="self-start bg-muted" onClick={() => inputRef.current?.click()}>
          Choisir un fichier...
        </Button>
      </ProfileFormField>

      <div className="font-semibold text-muted">Image de profil</div>

      <p className="max-w-4 border-l-4 pl-2 text-sm text-muted">
        Les images de profil sont gérées par <ExternalLink href="https://gravatar.com">gravatar</ExternalLink>
        . Pour changer la votre, vous devez créer un compte sur gravatar avec l'adresse email utilisée sur
        Shakala.
      </p>

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
      <ProfileFormField
        name="bio"
        label="Bio"
        description="Quelques mots à propos de vous, visible publiquement"
      >
        <textarea rows={3} className="w-full rounded border p-1" />
      </ProfileFormField>

      <p className="my-0 text-xs text-muted">La première ligne sera affichée sous votre pseudo</p>

      <SubmitButton primary className="self-end bg-muted">
        Changer
      </SubmitButton>
    </form>
  );
};
