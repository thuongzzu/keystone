/* @jsx jsx */

import { useEffect, useRef, useState, FormEvent } from 'react';

import { jsx, H1, Stack } from '@keystone-ui/core';
import { Button } from '@keystone-ui/button';
import { TextInput } from '@keystone-ui/fields';
import { Notice } from '@keystone-ui/notice';
import { useRawKeystone } from '@keystone-spike/admin-ui';

import { SigninContainer } from '../components/SigninContainer';
import { useMutation, DocumentNode } from '@keystone-spike/admin-ui/apollo';
import { useRouter } from '@keystone-spike/admin-ui/router';

export const SigninPage = ({ mutation }: { mutation: DocumentNode }) => {
  /* TODO:
    - [ ] Initialise with the current session, and bounce if the user is signed in
    - [x] Call mutation to actually sign in, then redirect
    - [ ] Show error messages when the user doesn't sign in successfully (inc. full & limited messages)
    - [ ] Handle a param for which page to redirect to, i.e ?from=/users/1
  */

  const [mode, setMode] = useState<'signin' | 'forgot password'>('signin');
  const [state, setState] = useState({ identity: '', secret: '' });
  const router = useRouter();
  const identityFieldRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    identityFieldRef.current?.focus();
  }, [mode]);

  const { adminMeta, authenticatedItem } = useRawKeystone();

  const [mutate, { error, loading }] = useMutation(mutation);

  return (
    <SigninContainer>
      <H1>Sign In</H1>
      <Stack
        gap="xlarge"
        as="form"
        onSubmit={async (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();

          if (mode === 'signin') {
            try {
              await mutate({
                variables: {
                  identity: state.identity,
                  secret: state.secret,
                },
              });
              if (adminMeta.state === 'error') {
                adminMeta.refetch();
              }
              if (authenticatedItem.state !== 'loading') {
                authenticatedItem.refetch();
              }
            } catch (err) {
              return;
            }

            router.push('/');
          }
        }}
      >
        {error && (
          <Notice title="Error" tone="negative">
            {error.message}
          </Notice>
        )}
        <Stack gap="medium">
          <TextInput
            name="identity"
            value={state.identity}
            onChange={e => setState({ ...state, identity: e.target.value })}
            placeholder="Email Address"
            ref={identityFieldRef}
          />
          {mode === 'signin' && (
            <TextInput
              name="password"
              value={state.secret}
              onChange={e => setState({ ...state, secret: e.target.value })}
              placeholder="password"
              type="password"
            />
          )}
        </Stack>

        {mode === 'forgot password' ? (
          <Stack gap="medium" across>
            <Button type="submit" weight="bold" tone="active">
              Log reset link
            </Button>
            <Button weight="none" tone="active" onPress={() => setMode('signin')}>
              Go back
            </Button>
          </Stack>
        ) : (
          <Stack gap="medium" across>
            <Button weight="bold" tone="active" isLoading={loading} type="submit">
              Sign In
            </Button>
            <Button weight="none" tone="active" onPress={() => setMode('forgot password')}>
              Forgot your password?
            </Button>
          </Stack>
        )}
      </Stack>
    </SigninContainer>
  );
};
